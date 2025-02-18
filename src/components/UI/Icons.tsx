import {
  Users,
  Pencil,
  Eraser,
  Image,
  StickyNote,
  Menu,
  X,
} from "lucide-react";
import IconProps from "../Interfaces/IconProps";
import { FcGoogle } from "react-icons/fc";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";
// Navbar Icons
export const MenuIcon = ({ className, size = 24, color }: IconProps) => (
  <Menu className={className} size={size} color={color} />
);

export const CloseIcon = ({ className, size = 24, color }: IconProps) => (
  <X className={className} size={size} color={color} />
);

// Whiteboard Tool Icons
export const CollaboratorsIcon = ({
  className,
  size = 24,
  color,
}: IconProps) => <Users className={className} size={size} color={color} />;

export const DrawIcon = ({ className, size = 24, color }: IconProps) => (
  <Pencil className={className} size={size} color={color} />
);

export const EraserIcon = ({ className, size = 24, color }: IconProps) => (
  <Eraser className={className} size={size} color={color} />
);

export const ImageIcon = ({ className, size = 24, color }: IconProps) => (
  <Image className={className} size={size} color={color} />
);

export const NoteIcon = ({ className, size = 24, color }: IconProps) => (
  <StickyNote className={className} size={size} color={color} />
);

export const GoogleIcon = ({ className, size = 24, color }: IconProps) => (
  <FcGoogle className={className} size={size} color={color} />
);

export const InstagramIcon = ({ className, size = 24, color }: IconProps) => (
  <FaInstagram className={className} size={size} color={color} />
);

export const GithubIcon = ({ className, size = 24, color }: IconProps) => (
  <FaGithub className={className} size={size} color={color} />
);

export const LinkedInIcon = ({ className, size = 24, color }: IconProps) => (
  <FaLinkedin className={className} size={size} color={color} />
);
export const TwitterIcon = ({ className, size = 24, color }: IconProps) => (
  <FaXTwitter className={className} size={size} color={color} />
);
export const LockIcon = ({ className, size = 24, color }: IconProps) => (
  <CiLock className={className} size={size} color={color} />
);

// Export default object for convenient imports
const Icons = {
  Menu: MenuIcon,
  Close: CloseIcon,
  Collaborators: CollaboratorsIcon,
  Draw: DrawIcon,
  Eraser: EraserIcon,
  Image: ImageIcon,
  Note: NoteIcon,
  Google: GoogleIcon,
  Instagram: InstagramIcon,
  Github: GithubIcon,
  Linkedin: LinkedInIcon,
  Twitter: TwitterIcon,
  Lock: LockIcon,
};

export default Icons;
