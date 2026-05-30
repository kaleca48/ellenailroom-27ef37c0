import logo from "@/assets/elle-logo.png";

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className, alt = "elle Nail Room" }: LogoProps) {
  return <img src={logo} alt={alt} className={className} />;
}

export { logo as logoSrc };
