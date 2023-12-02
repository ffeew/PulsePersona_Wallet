interface svgProps {
  className?: string;
}

export default function Documents({ className }: svgProps) {
  return (
    <svg
      viewBox="-0.5 -0.5 14 14"
      xmlns="http://www.w3.org/2000/svg"
      height="14"
      width="14"
      className={className}
    >
      <path
        d="M7.382375000000001 12.593750000000002H1.2187500000000002a0.8125000000000001 0.8125000000000001 0 0 1 -0.8125000000000001 -0.8125000000000001V1.2187500000000002a0.8125000000000001 0.8125000000000001 0 0 1 0.8125000000000001 -0.8125000000000001h10.562500000000002a0.8125000000000001 0.8125000000000001 0 0 1 0.8125000000000001 0.8125000000000001v6.163625000000001a0.8125000000000001 0.8125000000000001 0 0 1 -0.2377916666666667 0.5741666666666668l-4.399416666666667 4.399416666666667a0.8125000000000001 0.8125000000000001 0 0 1 -0.5741666666666668 0.2377916666666667Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
      <path
        d="M7.718750000000001 12.520625V8.531250000000002a0.8125000000000001 0.8125000000000001 0 0 1 0.8125000000000001 -0.8125000000000001h3.989375000000001"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
      <path
        d="m3.6562500000000004 3.6562500000000004 6.500000000000001 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
      <path
        d="m3.6562500000000004 6.093750000000001 2.8437500000000004 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      ></path>
    </svg>
  );
}
