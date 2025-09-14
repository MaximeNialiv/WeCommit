"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCog, faCat } from "@fortawesome/free-solid-svg-icons";

// --- Types
type DayData = {
  completion: number; // 0-100
  owner: string;
};

type Store = {
  habitName: string;
  owner: string;
  reminderOffsetMin: number; // -120 .. 120
  days: Record<string, DayData>; // key = yyyy-mm-dd
};

// --- Utils
const todayIso = () => new Date().toISOString().slice(0, 10);
const toISO = (d: Date) => d.toISOString().slice(0, 10);

const frDate = (d: Date) =>
d.toLocaleDateString("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

const monthAbbr = (d: Date) =>
d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();

// Get weeks for a month with proper 7-column layout
const getMonthWeeks = (year: number, monthIndex: number) => {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  // Start from Monday of the week containing the first day
  const startDate = new Date(firstDay);
  const dayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  startDate.setDate(firstDay.getDate() - dayOfWeek);

  const weeks: Date[][] = [];
  const currentDate = new Date(startDate);

  while (
  currentDate <= lastDay ||
  weeks.length === 0 ||
  currentDate.getDay() !== 1)
  {
    if (currentDate.getDay() === 1 || weeks.length === 0) {
      weeks.push([]);
    }

    weeks[weeks.length - 1].push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);

    if (weeks[weeks.length - 1].length === 7) {
      if (
      currentDate > lastDay &&
      weeks[weeks.length - 1].some((d) => d.getMonth() === monthIndex))
      {
        break;
      }
    }
  }

  return weeks;
};

const lastNMonthsFrom = (anchor: Date, count: number) => {
  const months: {year: number;monthIndex: number;key: string;}[] = [];
  const a = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(a.getFullYear(), a.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      key: `${d.getFullYear()}-${d.getMonth() + 1}`
    });
  }
  return months;
};

// --- Storage
const STORAGE_KEY = "habit-tracker:v1";
const loadStore = (): Store => {
  if (typeof window === "undefined")
  return {
    habitName: "Nourrir Naboo (~100g croq)",
    owner: "Maxime",
    reminderOffsetMin: -2,
    days: {}
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no store");
    const parsed = JSON.parse(raw) as Store;
    return {
      habitName: parsed.habitName || "Nourrir Naboo (~100g croq)",
      owner: parsed.owner || "Maxime",
      reminderOffsetMin: parsed.reminderOffsetMin ?? -2,
      days: parsed.days || {}
    };
  } catch {
    return {
      habitName: "Nourrir Naboo (~100g croq)",
      owner: "Maxime",
      reminderOffsetMin: -2,
      days: {}
    };
  }
};

// --- User colors
const userColors: Record<
  string,
  {base: string;light: string;lighter: string;}> =
{
  Maxime: {
    base: "bg-green-600",
    light: "bg-green-400",
    lighter: "bg-green-200"
  },
  Chloé: { base: "bg-blue-600", light: "bg-blue-400", lighter: "bg-blue-200" },
  Camille: {
    base: "bg-purple-600",
    light: "bg-purple-400",
    lighter: "bg-purple-200"
  }
};

const getColorForCompletion = (owner: string, completion: number) => {
  const colors = userColors[owner] || userColors.Maxime;
  if (completion >= 80) return colors.base;
  if (completion >= 40) return colors.light;
  if (completion > 0) return colors.lighter;
  return "bg-gray-100";
};

// --- Components

// Display one day cell
function DayCell({
  d,
  completion,
  isToday,
  isFuture,
  isSelected,
  isCurrentMonth,
  owner,
  onTap









}: {d: Date | null;completion: number;isToday: boolean;isFuture: boolean;isSelected: boolean;isCurrentMonth: boolean;owner: string;onTap: () => void;}) {
  if (!d) {
    // Empty cell
    return (
      <div
        className="aspect-square border border-gray-200 bg-gray-50"
        data-oid="mgg.v75" />);


  }

  const bgColor = isCurrentMonth ?
  getColorForCompletion(owner, completion) :
  "bg-gray-100";
  const clickable = !isFuture && isCurrentMonth;

  return (
    <button
      onClick={clickable ? onTap : undefined}
      disabled={!clickable}
      className={`
        aspect-square border border-gray-300 ${bgColor} relative
        ${clickable ? "cursor-pointer hover:border-gray-400" : ""}
        ${isToday ? "border-2 border-black" : ""}
        ${isSelected ? "border-2 border-black" : ""}
        ${isFuture && isCurrentMonth ? "border-dashed border-green-500" : ""}
        ${!isCurrentMonth ? "opacity-30" : ""}
        transition-all duration-150
      `}
      data-oid="zz-:k8e">

      {isToday &&
      <div
        className="absolute inset-0 flex items-center justify-center"
        data-oid="ex:qnqz">

          <div className="w-3 h-3 bg-black rounded-full" data-oid="93xbb61" />
        </div>
      }
    </button>);

}

// One month section with proper 8-column grid
function MonthSection({
  year,
  monthIndex,
  days,
  owner,
  selectedDay,
  onDayTap







}: {year: number;monthIndex: number;days: Record<string, DayData>;owner: string;selectedDay: string | null;onDayTap: (iso: string) => void;}) {
  const monthWeeks = useMemo(
    () => getMonthWeeks(year, monthIndex),
    [year, monthIndex]
  );
  const now = new Date();
  const tIso = todayIso();

  return (
    <div
      className="bg-white rounded-2xl border-4 border-black p-4 mb-4"
      data-oid="o6x:6pp">

      {monthWeeks.map((week, weekIndex) =>
      <div
        key={weekIndex}
        className="grid grid-cols-8 gap-1 mb-1"
        data-oid="dq_ndji">

          {/* Month label in first column (only for first week) */}
          <div
          className="aspect-square flex items-center justify-center"
          data-oid="c4lmm:a">

            {weekIndex === 0 &&
          <div
            className="text-sm font-bold text-gray-800 writing-mode-vertical transform rotate-180"
            data-oid="-okfnqn">

                {monthAbbr(new Date(year, monthIndex, 1))}
              </div>
          }
          </div>

          {/* 7 day columns */}
          {week.map((d, dayIndex) => {
          const iso = toISO(d);
          const dayData = days[iso];
          const completion = dayData?.completion || 0;
          const dayOwner = dayData?.owner || owner;
          const isToday = iso === tIso;
          const isFuture = d > now;
          const isSelected = iso === selectedDay;
          const isCurrentMonth = d.getMonth() === monthIndex;

          return (
            <DayCell
              key={dayIndex}
              d={d}
              completion={completion}
              isToday={isToday}
              isFuture={isFuture}
              isSelected={isSelected}
              isCurrentMonth={isCurrentMonth}
              owner={dayOwner}
              onTap={() => onDayTap(iso)}
              data-oid="15kgn1r" />);


        })}
        </div>
      )}
    </div>);

}

export default function Page() {
  const [store, setStore] = useState<Store>(loadStore);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const months = useMemo(() => lastNMonthsFrom(new Date(), 5), []);

  const setDayCompletion = (
  iso: string,
  completion: number,
  owner?: string) =>
  {
    setStore((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [iso]: {
          completion,
          owner: owner || prev.days[iso]?.owner || prev.owner
        }
      }
    }));
  };

  const handleDayTap = (iso: string) => {
    setSelectedDay(iso);
    const current = store.days[iso]?.completion || 0;
    const next = current >= 100 ? 0 : current + 25; // 0 -> 25 -> 50 -> 75 -> 100 -> 0
    setDayCompletion(iso, next);
  };

  const handleSliderChange = (value: number) => {
    if (selectedDay) {
      setDayCompletion(selectedDay, value);
    }
  };

  const handleOwnerChange = (newOwner: string) => {
    if (selectedDay) {
      const currentCompletion = store.days[selectedDay]?.completion || 0;
      setDayCompletion(selectedDay, currentCompletion, newOwner);
    } else {
      setStore({ ...store, owner: newOwner });
    }
  };

  // Days since last 100% completion
  const daysSinceLastComplete = useMemo(() => {
    const sortedDays = Object.entries(store.days).
    filter(([_, data]) => data.completion >= 100).
    map(([iso]) => new Date(iso)).
    sort((a, b) => b.getTime() - a.getTime());

    if (sortedDays.length === 0) return 0;

    const lastComplete = sortedDays[0];
    const today = new Date();
    const diffTime = today.getTime() - lastComplete.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [store.days]);

  // computed
  const t = new Date();
  const headerDate = frDate(t);
  const tIso = todayIso();
  const selectedCompletion = selectedDay ?
  store.days[selectedDay]?.completion || 0 :
  0;
  const selectedOwner = selectedDay ?
  store.days[selectedDay]?.owner || store.owner :
  store.owner;
  const todayCompletion = store.days[tIso]?.completion || 0;

  // Monthly completion
  const doneThisMonth = useMemo(() => {
    let total = 0;
    let count = 0;
    Object.entries(store.days).forEach(([k, v]) => {
      const d = new Date(k);
      if (
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear() &&
      d <= new Date())
      {
        total += v.completion;
        count++;
      }
    });
    return count > 0 ? Math.round(total / count) : 0;
  }, [store.days, t]);

  return (
    <div
      className="h-screen flex flex-col bg-gray-50 text-black font-sans max-w-md mx-auto"
      data-oid="74f8qru">

      {/* Fixed Header */}
      <div
        className="flex-shrink-0 bg-white border-b-4 border-black px-4 py-4 safe-top"
        data-oid="o3022a0">

        <div className="flex items-center justify-between" data-oid=".i.s402">
          <div className="flex-1 text-center" data-oid="f9tl22b" key="olk-3J7W">
            <h1 className="text-xl font-black leading-tight" data-oid="0yslkig">
              {headerDate.charAt(0).toUpperCase() + headerDate.slice(1)}
            </h1>
          </div>
        </div>
      </div>

      {/* Scrollable Calendar Grid */}
      <div className="flex-1 overflow-y-auto p-4" data-oid="nux062x">
        {months.map((m) =>
        <MonthSection
          key={m.key}
          year={m.year}
          monthIndex={m.monthIndex}
          days={store.days}
          owner={store.owner}
          selectedDay={selectedDay}
          onDayTap={handleDayTap}
          data-oid="j3ytghe" />

        )}
        {/* Padding at bottom to ensure last month is fully visible */}
        <div className="h-4" data-oid="_lge2qo" />
      </div>

      {/* Fixed Footer */}
      <div
        className="flex-shrink-0 bg-white border-t-4 border-black px-4 py-3 space-y-3 safe-bottom"
        data-oid="bg.mts5">

        {/* First line: Habit info + User + Status */}
        <div className="flex items-center gap-3" data-oid="b1wvu27">
          <div
            className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center flex-shrink-0"
            data-oid="5l9o82p">

            <FontAwesomeIcon
              icon={faCat}
              className="w-5 h-5 text-white"
              data-oid="n7:liv9" />

          </div>
          <div className="flex-1 min-w-0" data-oid="iyearv.">
            <input
              value={store.habitName}
              onChange={(e) =>
              setStore({ ...store, habitName: e.target.value })
              }
              className="w-full bg-transparent font-medium text-sm outline-none truncate"
              data-oid="ww0xi5." />

          </div>
          <select
            value={selectedOwner}
            onChange={(e) => handleOwnerChange(e.target.value)}
            className={`
              px-3 py-2 rounded-2xl border-4 border-black font-bold text-white text-sm flex-shrink-0
              ${userColors[selectedOwner]?.base || "bg-green-600"}
            `}
            data-oid="-lw6_46">

            <option value="Maxime" data-oid="m4sr239">
              Maxime
            </option>
            <option value="Chloé" data-oid=":gv1ymo">
              Chloé
            </option>
            <option value="Camille" data-oid="4i7za1-">
              Camille
            </option>
          </select>

          <div
            className={`
            px-3 py-2 rounded-2xl border-4 font-bold text-sm flex-shrink-0
            ${
            selectedDay ?
            "bg-white text-black border-black border-dashed" :
            todayCompletion >= 80 ?
            "bg-green-600 text-white border-black" :
            "bg-white text-green-700 border-green-700 border-dashed"}
          `
            }
            data-oid="8f5v5_n">

            {selectedDay ?
            `${selectedCompletion}% - ${new Date(
              selectedDay
            ).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short"
            })}` :
            todayCompletion >= 80 ?
            "Fait" :
            "À faire !"}
          </div>
        </div>

        {/* Second line: Days counter + Slider + Monthly percentage */}
        <div className="flex items-center gap-3" data-oid="qy5kjrp">
          <div
            className="bg-black text-white px-3 py-2 rounded-2xl text-sm font-bold min-w-[4rem] text-center flex-shrink-0"
            data-oid="lw87f2n">

            {daysSinceLastComplete > 0 ? "-" : ""}
            {daysSinceLastComplete}j
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={25}
            value={selectedDay ? selectedCompletion : todayCompletion}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            disabled={!selectedDay}
            className="flex-1 accent-green-600"
            data-oid=":wxat.9" />


          <div
            className="bg-green-100 text-green-800 px-3 py-2 rounded-2xl text-sm font-bold min-w-[4rem] text-center flex-shrink-0"
            data-oid="hvekmt0">

            {doneThisMonth}%
          </div>
        </div>
      </div>
    </div>);

}