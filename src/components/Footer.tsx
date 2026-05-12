export function Footer() {
  return (
    <footer className="w-full px-6 py-8 mt-auto border-t border-(--color-border)">
      <p className="text-xs text-(--color-text-muted) text-center">
        © {new Date().getFullYear()} pabitella. All rights reserved.
      </p>
    </footer>
  );
}
