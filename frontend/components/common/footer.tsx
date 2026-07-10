

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 bg-background/50 w-full border-t py-8 mt-auto">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center md:px-12">
        <p className="text-muted-foreground text-xs sm:text-sm">
          &copy; {currentYear} LibraFlow Digital Library. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
