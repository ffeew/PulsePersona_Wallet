interface svgProps {
  className?: string;
}

export default function SmileyFace({ className }: svgProps) {
  return (
    <svg
      viewBox="-0.5 -0.5 14 14"
      xmlns="http://www.w3.org/2000/svg"
      height="14"
      width="14"
      className={className}
    >
      <path
        d="M0.40625000000000006 6.500000000000001a6.093750000000001 6.093750000000001 0 1 0 12.187500000000002 0 6.093750000000001 6.093750000000001 0 1 0 -12.187500000000002 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
      <path
        d="M10.156250000000002 7.312500000000001a3.6562500000000004 3.6562500000000004 0 0 1 -7.312500000000001 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
      <path
        d="M10.017041666666668 5.281250000000001a1.2187500000000002 1.2187500000000002 0 0 0 -2.298291666666667 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
      <path
        d="M5.281250000000001 5.281250000000001a1.2187500000000002 1.2187500000000002 0 0 0 -2.298291666666667 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
    </svg>
  );
}
