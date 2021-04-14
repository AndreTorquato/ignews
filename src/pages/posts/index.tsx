import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title> Posts | Ignews </title>
      </Head>
      <main className={styles.container}>
          <div className={styles.posts}>
              <a>
                  <time>12 de dezembro </time>
                   <strong>Creates</strong>
                   <p>Telakdask asdlksadlkasdkl dkas kasd klaslkdaskl dklasd kdlasdk adkla dkaldka dlaks dkaslda kdal daskdaskldaslkd as d</p>
              </a>
          </div>
      </main>
    </>
  );
}
