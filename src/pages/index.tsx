import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.contentContainer}>
        <Link href="/">
          <a>
            <h1>Como utilizar Hooks</h1>
            <p>pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfoContainer}>
              <div>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <FiUser />
                <span>Joseph Oliveira</span>
              </div>
            </div>
          </a>
        </Link>
        <Link href="/">
          <a>
            <h1>Como utilizar Hooks</h1>
            <p>pensando em sincronização em vez de ciclos de vida.</p>
            <time>15 Mar 2021</time> <span>Joseph Oliveira</span>
          </a>
        </Link>
      </div>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
