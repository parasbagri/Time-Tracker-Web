import { writable } from 'svelte/store';

export const user = writable(null);
export const isAuthenticated = writable(false);

const createTimerStore = () => {
	const { subscribe, set, update } = writable({});
    const intervals = new Map();

	return {
		subscribe,
		startTimer: (taskId, timeLogId, startTime) => {
			update(timers => {
				if (intervals.has(taskId)) {
					clearInterval(intervals.get(taskId));
				}

				const newTimers = {
					...timers,
					[taskId]: {
						timeLogId,
						startTime: new Date(startTime),
						elapsedTime: 0
					}
				};

				const intervalId = setInterval(() => {
					update(currentTimers => {
						if (currentTimers[taskId]) {
							const elapsed = Math.floor((new Date() - currentTimers[taskId].startTime) / 1000);
							return {
								...currentTimers,
								[taskId]: {
									...currentTimers[taskId],
									elapsedTime: elapsed
								}
							};
						}
						return currentTimers;
					});
				}, 1000);

				intervals.set(taskId, intervalId);
				return newTimers;
			});
		},
		stopTimer: (taskId) => {
			update(timers => {
				if (intervals.has(taskId)) {
					clearInterval(intervals.get(taskId));
					intervals.delete(taskId);
				}
				const newTimers = { ...timers };
				delete newTimers[taskId];
				return newTimers;
			});
		},
		initTimer: (taskId, timeLogId, startTime) => {
			update(timers => {
				if (timers[taskId]) {
					return timers;
				}

				if (intervals.has(taskId)) {
					clearInterval(intervals.get(taskId));
				}

				const start = new Date(startTime);
				const elapsed = Math.floor((new Date() - start) / 1000);

				const newTimers = {
					...timers,
					[taskId]: {
						timeLogId,
						startTime: start,
						elapsedTime: elapsed
					}
				};

				const intervalId = setInterval(() => {
					update(currentTimers => {
						if (currentTimers[taskId]) {
							const elapsed = Math.floor((new Date() - currentTimers[taskId].startTime) / 1000);
							return {
								...currentTimers,
								[taskId]: {
									...currentTimers[taskId],
									elapsedTime: elapsed
								}
							};
						}
						return currentTimers;
					});
				}, 1000);

				intervals.set(taskId, intervalId);
				return newTimers;
			});
		},
		clearAll: () => {
			intervals.forEach(intervalId => clearInterval(intervalId));
			intervals.clear();
			set({});
		}
	};
};

export const timerStore = createTimerStore();

