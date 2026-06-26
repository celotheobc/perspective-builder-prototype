export default function PerspectiveIcon({
  size = 20,
  className,
  title = 'Perspective',
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <rect
        x="9"
        y="3"
        width="6"
        height="4"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 7v2.5M6 9.5h12M6 9.5V12.5M18 9.5V12.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3.5"
        y="12.5"
        width="5"
        height="4"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="15.5"
        y="12.5"
        width="5"
        height="4"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}
