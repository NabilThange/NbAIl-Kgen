import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface MinimalHeaderProps {
  title: string;
}

export default function MinimalHeader({ title }: MinimalHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      <Link href="/chat" passHref>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Go to Chat</Button>
      </Link>
    </header>
  );
} 