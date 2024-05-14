import Header from "./Header";
import { colors } from '../../public/colors';
const {color200, color50} = colors;


export default function Home() {

  return (
    <div className={`${color50}`}>
      <Header />
      <main className="flex flex-col items-center justify-between p-24 pt-64">
        <h2>Em construção...</h2>
      </main>
    </div>
  );
}
