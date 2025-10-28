type ToggleSwitchProps<T extends string | boolean> = {
  id: string;
  name: string;
  label: string;
  value: T;
  activeValue: T;
  inactiveValue: T;
  onToggle: (newValue: T) => void;
  icons?: { on?: React.ReactNode; off?: React.ReactNode };
};

const ToggleSwitch = <T extends string | boolean>({
  id,
  name,
  label,
  value,
  activeValue,
  inactiveValue,
  onToggle,
  icons,
}: ToggleSwitchProps<T>) => {
  const isActive = value === activeValue;

  const handleToggle = () => {
    onToggle(isActive ? inactiveValue : activeValue);
  };

  return (
    <div className="flex items-center gap-3">
      <span>{label}</span>

      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isActive}
        onChange={handleToggle}
        className="hidden"
      />

      <label
        htmlFor={id}
        className={`w-[75px] h-[35px] rounded-full cursor-pointer border relative overflow-hidden
          before:content-[''] before:absolute before:w-[26px] before:h-[26px] before:rounded-full
          before:top-1/2 before:-translate-y-1/2 hover:before:scale-105 before:duration-300
          ${
            isActive
              ? "before:left-[calc(100%-30px)] bg-(--color-primary) before:bg-(--color-bg) hover:before:brightness-400"
              : "before:left-1 bg-transparent before:bg-(--color-text) hover:before:brightness-90"
          }`}
      >
        <span
          className={`absolute left-1 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        >
          {icons?.on && icons.on}
        </span>

        <span
          className={`absolute right-1 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
            isActive ? "opacity-0" : "opacity-100"
          }`}
        >
          {icons?.off && icons.off}
        </span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
