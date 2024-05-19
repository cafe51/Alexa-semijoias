import Footer from './Footer';
import Header from './Header';

export default function BodyWithHeaderAndFooter({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col justify-between min-h-screen secColor">
            <Header />
            <main className="flex text-start flex-col gap-4 items-start justify-between pt-40 p-6">
                { children }
            </main>
            <Footer />
        </div>
    );
}
