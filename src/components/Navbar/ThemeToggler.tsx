import { IconChevronDown, IconSun } from "@tabler/icons-react";
import { useEffect } from "react";

const ThemeToggler = () => {
  const themes = [
    "light",
    "dark",
  ];

  useEffect(() => {
    let storedTheme = localStorage.getItem("theme") || "light";
    if (!themes.includes(storedTheme)) {
      storedTheme = "light";
    }
    applyTheme(storedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const handleThemeChange = (theme: string) => {
    applyTheme(theme);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-primary text-primary-content flex items-center gap-2"
      >
        <IconSun />
        <IconChevronDown />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-[100] w-52 p-2 overflow-y-auto block shadow-2xl text-base-content"
      >
        {themes.map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              aria-label={theme}
              value={theme}
              onChange={() => handleThemeChange(theme)}
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start capitalize"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeToggler;
