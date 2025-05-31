import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'chartjs-adapter-date-fns';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';

import Navbar from '../components/Navbar';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

// Map emojis to numeric values for averaging
const moodToValue = {
  '😢': 1,
  '😔': 2,
  '😐': 3,
  '😊': 4,
  '😄': 5,
};
// Map numeric values back to emojis for labels
const valueToEmoji = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '😊',
  5: '😄',
};
// Prevent selecting dates before 2025 and future dates
const minDate = '2025-01-01';
const maxDate = new Date().toISOString().split('T')[0];

const MoodTrackPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Controls for week navigation
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 6);
    return start;
  });
  const [hasData, setHasData] = useState(true);

  const username = localStorage.getItem('tokenUser');

  // Fetch existing mood entries
  useEffect(() => {
    axios
      .get(`http://localhost:4000/moods/${username}`)
      .then(res => setMoodData(res.data))
      .catch(err => console.error('Error fetching mood data:', err));
  }, [username]);

  // Recompute chart whenever moodData or startDate changes
  useEffect(() => {
    if (!moodData.length) {
      setHasData(false);
      setChartData({ labels: [], datasets: [] });
      return;
    }
    const start = startDate;
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // Group entries by date
    const grouped = moodData.reduce((acc, entry) => {
      const dateKey = entry.date.split('T')[0];
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(entry);
      return acc;
    }, {});

    // Build full week label array from start to end
    const dateLabels = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dateLabels.push(d.toISOString().split('T')[0]);
    }

    // Compute daily mood (use last entry) or null
    const dailyMoodValues = dateLabels.map(date => {
      const entries = (grouped[date] || []).slice();
      if (!entries.length) return null;
      // sort by timestamp to get last
      entries.sort((a, b) => new Date(a.date) - new Date(b.date));
      return moodToValue[entries[entries.length - 1].mood] || null;
    });

    // Trim to only span between first and last day with data
    const firstIdx = dailyMoodValues.findIndex(v => v != null);
    const lastIdx =
      dailyMoodValues.length -
      1 -
      [...dailyMoodValues].reverse().findIndex(v => v != null);
    const labels = dateLabels.slice(firstIdx, lastIdx + 1);
    const daily = dailyMoodValues.slice(firstIdx, lastIdx + 1);

    // Fill gaps by carrying last known mood forward
    const filledDaily = [];
    daily.forEach((v, idx) => {
      if (v == null) {
        // carry previous value
        filledDaily[idx] = idx > 0 ? filledDaily[idx - 1] : null;
      } else {
        filledDaily[idx] = v;
      }
    });

    // Compute linear regression trend line
    const n = filledDaily.length;
    const xs = [...Array(n).keys()];
    const ys = filledDaily;
    const xMean = (n - 1) / 2; // average of 0..n-1
    const yMean = ys.reduce((s, v) => s + v, 0) / n;
    let cov = 0,
      varX = 0;
    xs.forEach((x, i) => {
      cov += (x - xMean) * (ys[i] - yMean);
      varX += (x - xMean) ** 2;
    });
    const slope = varX ? cov / varX : 0;
    const intercept = yMean - slope * xMean;
    const trendLine = xs.map(x => intercept + slope * x);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Daily Mood',
          data: filledDaily,
          spanGaps: true,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.2,
          pointRadius: 4,
        },
        {
          label: 'Trend',
          data: trendLine,
          spanGaps: true,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
      ],
    });
    setHasData(dailyMoodValues.some(v => v != null));
  }, [moodData, startDate]);

  const prevWeek = () => {
    const prev = new Date(startDate);
    prev.setDate(prev.getDate() - 7);
    setStartDate(prev);
  };
  const nextWeek = () => {
    const next = new Date(startDate);
    next.setDate(next.getDate() + 7);
    setStartDate(next);
  };

  const handleMoodSelect = mood => {
    axios
      .post(`http://localhost:4000/moods/${username}`, {
        date: selectedDate,
        mood,
      })
      .then(res => {
        setMoodData(prev => [...prev, res.data]);
        setIsModalOpen(false);
      })
      .catch(err => console.error('Error saving mood:', err));
  };

  const moodLabels = ['😄', '😊', '😐', '😔', '😢'];

  return (
    <>
      <Navbar />
      <div
        className="container mx-auto p-6 mt-20 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg shadow-lg"
        style={{ maxWidth: '840px' }}
      >
        {/* Date picker & mood modal */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex items-center justify-center space-x-4">
          <div className="text-lg font-medium">
            Select mood for {format(new Date(selectedDate), 'MMMM d')}
          </div>
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={date => {
              const iso = format(date, 'yyyy-MM-dd');
              setSelectedDate(iso);
              setIsModalOpen(true);
            }}
            dateFormat="MMMM d, yyyy"
            minDate={new Date(2025, 0, 1)}
            maxDate={new Date()}
            className="w-48 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
            calendarClassName="rounded-lg shadow-lg border border-gray-300"
            popperClassName="z-10"
            popperProps={{ strategy: 'fixed' }}
            showPopperArrow={false}
            withPortal
            placeholderText="Choose a date"
          />
          <Transition appear show={isModalOpen} as={React.Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsModalOpen(false)}
            >
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </TransitionChild>
              <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                <TransitionChild
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="bg-white p-6 rounded-2xl shadow-xl">
                    <DialogTitle className="text-lg font-medium">
                      How do you feel today?
                    </DialogTitle>
                    <div className="mt-4 flex justify-around">
                      {moodLabels.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleMoodSelect(emoji)}
                          className="text-4xl hover:scale-110 transform transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </Transition>
        </div>
        {/* Time-series chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevWeek}
              disabled={startDate <= new Date(minDate)}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous Week
            </button>
            <span className="font-medium">
              {format(startDate, 'MMMM d')} –{' '}
              {format(
                new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
                'MMMM d'
              )}
            </span>
            <button
              onClick={nextWeek}
              disabled={
                new Date(startDate).setDate(startDate.getDate() + 6) >=
                new Date(maxDate)
              }
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next Week
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-center">
            Weekly Mood Tracker
          </h2>
          <div className="h-96">
            {hasData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false, position: 'top' },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      callbacks: {
                        title: items => {
                          const ts = items[0]?.parsed?.x;
                          return ts ? format(new Date(ts), 'MMMM d') : '';
                        },
                        label: context => {
                          // Only show the mood for the daily dataset
                          if (context.dataset.label === 'Daily Mood') {
                            const val = context.parsed.y;
                            const emoji =
                              val != null ? valueToEmoji[Math.round(val)] : '';
                            return emoji ? `Mood: ${emoji}` : '';
                          }
                          return null;
                        },
                      },
                    },
                  },
                  layout: {
                    padding: { top: 60, bottom: 40, left: 30, right: 30 },
                  },
                  scales: {
                    x: {
                      type: 'time',
                      time: { unit: 'day', displayFormats: { day: 'MMM d' } },
                    },
                    y: {
                      min: 1,
                      max: 5,
                      ticks: {
                        stepSize: 0.5,
                        callback: value => valueToEmoji[value] || '',
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Not enough data for this week 😢
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodTrackPage;
