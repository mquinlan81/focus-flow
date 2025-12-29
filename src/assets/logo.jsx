export default function Logo({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* A simple geometric 'F' or Focus icon */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
      <path
        d="M40 30V70M40 30H65M40 50H60"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="70" cy="70" r="8" fill="var(--ff-aqua)" />
    </svg>
  );
}
