import Link from 'next/link';

export function Navigation() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/students', label: 'Students' },
    { href: '/store', label: 'Store' },
  ];

  return (
    <nav className="bg-gray-900 text-white p-2">
      <div className="container mx-auto flex gap-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:bg-gray-700 px-3 py-2 rounded">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
