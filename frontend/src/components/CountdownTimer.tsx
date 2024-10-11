"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";

const CountdownTimer = ({ initialTime }: ICountdownTimer) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const [hours, minutes] = initialTime
      .split(" ")
      .map((part) => parseInt(part));
    const totalSeconds = (hours || 0) * 3600 + (minutes || 0) * 60;
    setTimeLeft(totalSeconds);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

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
    <Badge variant="outline" className="text-lg bg-amber-700 text-white">
      <Clock className="h-5 w-5 mr-2" />
      {formatTime(timeLeft)}
    </Badge>
  );
};

export default CountdownTimer;
