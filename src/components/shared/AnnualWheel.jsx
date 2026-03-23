import { cn } from '@/lib/utils'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des',
]

const CATEGORY_COLORS = {
  '2': '#3b82f6', // Bygning - blue
  '3': '#10b981', // VVS - green
  '4': '#f59e0b', // Elkraft - amber
  '5': '#8b5cf6', // Tele - purple
  '6': '#ec4899', // Andre - pink
  '7': '#06b6d4', // Utendørs - cyan
}

function getCategoryColor(code) {
  return CATEGORY_COLORS[code?.[0]] || '#94a3b8'
}

export default function AnnualWheel({ tasks, selectedMonth, onMonthClick }) {
  const currentMonth = new Date().getMonth()
  const cx = 160
  const cy = 160
  const outerR = 140
  const innerR = 70

  const tasksByMonth = {}
  tasks.forEach((t) => {
    const m = t.monthDue
    if (m >= 1 && m <= 12) {
      if (!tasksByMonth[m]) tasksByMonth[m] = []
      tasksByMonth[m].push(t)
    }
  })

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[320px]">
        {MONTHS.map((month, i) => {
          const startAngle = (i * 30 - 90) * (Math.PI / 180)
          const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180)
          const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180)

          const x1Outer = cx + outerR * Math.cos(startAngle)
          const y1Outer = cy + outerR * Math.sin(startAngle)
          const x2Outer = cx + outerR * Math.cos(endAngle)
          const y2Outer = cy + outerR * Math.sin(endAngle)
          const x1Inner = cx + innerR * Math.cos(endAngle)
          const y1Inner = cy + innerR * Math.sin(endAngle)
          const x2Inner = cx + innerR * Math.cos(startAngle)
          const y2Inner = cy + innerR * Math.sin(startAngle)

          const labelR = (outerR + innerR) / 2
          const labelX = cx + labelR * Math.cos(midAngle)
          const labelY = cy + labelR * Math.sin(midAngle)

          const isCurrentMonth = i === currentMonth
          const isSelected = selectedMonth === i + 1
          const monthTasks = tasksByMonth[i + 1] || []

          const path = [
            `M ${x1Outer} ${y1Outer}`,
            `A ${outerR} ${outerR} 0 0 1 ${x2Outer} ${y2Outer}`,
            `L ${x1Inner} ${y1Inner}`,
            `A ${innerR} ${innerR} 0 0 0 ${x2Inner} ${y2Inner}`,
            'Z',
          ].join(' ')

          const dotR = innerR + 12
          const maxDots = Math.min(monthTasks.length, 4)

          return (
            <g
              key={month}
              onClick={() => onMonthClick?.(i + 1)}
              className="cursor-pointer"
            >
              <path
                d={path}
                fill={isSelected ? '#dbeafe' : isCurrentMonth ? '#f0f9ff' : '#f8fafc'}
                stroke={isSelected ? '#3182ce' : isCurrentMonth ? '#93c5fd' : '#e2e8f0'}
                strokeWidth={isSelected ? 2 : 1}
                className="transition-colors hover:fill-blue-50"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'text-[10px] select-none pointer-events-none',
                  isCurrentMonth || isSelected ? 'font-bold fill-hemvar-700' : 'fill-gray-500'
                )}
              >
                {month}
              </text>
              {Array.from({ length: maxDots }).map((_, di) => {
                const dotAngle = startAngle + ((di + 0.5) / maxDots) * (endAngle - startAngle)
                const dx = cx + dotR * Math.cos(dotAngle)
                const dy = cy + dotR * Math.sin(dotAngle)
                return (
                  <circle
                    key={di}
                    cx={dx}
                    cy={dy}
                    r={3}
                    fill={getCategoryColor(monthTasks[di]?.ns3451Category)}
                    className="pointer-events-none"
                  />
                )
              })}
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={innerR - 5} fill="white" />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="text-[14px] font-bold fill-gray-900"
        >
          2026
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          className="text-[10px] fill-gray-500"
        >
          Årshjul
        </text>
      </svg>

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {Object.entries(CATEGORY_COLORS).map(([code, color]) => {
          const labels = { '2': 'Bygning', '3': 'VVS', '4': 'Elkraft', '5': 'Tele', '6': 'Andre', '7': 'Utendørs' }
          return (
            <div key={code} className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {labels[code]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
