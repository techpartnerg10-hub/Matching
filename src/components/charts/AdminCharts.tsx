"use client";

import * as React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export function KeywordUsageBar({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // 그라데이션 색상 생성 (밝고 선명한 보라색 계열)
  const generateGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)"); // 밝은 보라색
    gradient.addColorStop(1, "rgba(124, 58, 237, 0.9)"); // 브랜드 보라색
    return gradient;
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      <Bar
      data={{
        labels,
        datasets: [
          {
            label: "사용 빈도",
            data: values,
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return "rgba(139, 92, 246, 0.8)";
              return generateGradient(ctx);
            },
            borderColor: "rgba(167, 139, 250, 1)",
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: {
              color: "#eaf0ff",
              font: { size: 11 },
              maxRotation: 45,
              minRotation: 45,
            },
            grid: { 
              color: "rgba(255,255,255,0.08)"
            },
            border: { display: false },
          },
          y: {
            ticks: {
              color: "#eaf0ff",
              font: { size: 11 },
            },
            grid: { 
              color: "rgba(255,255,255,0.08)"
            },
            border: { display: false },
          },
        },
      }}
      width={width}
      height={280}
    />
    </div>
  );
}

export function RequestStatusDoughnut({
  pending,
  approved,
  rejected,
}: {
  pending: number;
  approved: number;
  rejected: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setSize(Math.min(containerWidth, 384));
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full flex items-center justify-center">
      <Doughnut
      data={{
        labels: ["대기", "승인", "반려"],
        datasets: [
          {
            data: [pending, approved, rejected],
            backgroundColor: [
              "rgba(139, 92, 246, 0.85)", // 밝은 보라색 (대기)
              "rgba(74, 222, 128, 0.85)", // 밝은 초록색 (승인)
              "rgba(251, 146, 60, 0.85)", // 밝은 주황색 (반려 - 빨간색 대신)
            ],
            borderColor: [
              "rgba(167, 139, 250, 1)", // 더 밝은 보라색 테두리
              "rgba(134, 239, 172, 1)", // 더 밝은 초록색 테두리
              "rgba(253, 186, 116, 1)", // 더 밝은 주황색 테두리
            ],
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#eaf0ff",
              padding: 10,
              font: { size: 11 },
              boxWidth: 12,
              boxHeight: 12,
            },
          },
        },
      }}
      width={size}
      height={280}
    />
    </div>
  );
}


