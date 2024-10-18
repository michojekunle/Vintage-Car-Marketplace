"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";

interface ICountdownTimer {
  initialTime: string;
}

const CountdownTimer: React.FC<ICountdownTimer> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const endTime = new Date(parseInt(initialTime) * 1000);
    const updateTimer = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [initialTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Badge variant="destructive" className="text-white text-sm">
      <Clock className="h-4 w-4 mr-2" />
      {formatTime(timeLeft)}
    </Badge>
  );
};

export default CountdownTimer;
