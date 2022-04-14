import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';

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

export default function Home({ postsPagination }: HomeProps) {
  const postsRes = postsPagination.results;

  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  useEffect(() => {
    setPosts(postsRes);
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.logoContainer}>
          <Header />
        </div>
        <div className={styles.contentContainer}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.postInfoContainer}>
                  <div>
                    <FiCalendar />
                    <time>
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        { locale: ptBR }
                      )}
                    </time>
                  </div>
                  <div>
                    <FiUser />
                    <span>{post.data.author}</span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {nextPage ? (
            <a onClick={() => getMorePosts(postsPagination.next_page, posts, setPosts, setNextPage)} className={styles.loadMorePosts}>Carregar mais posts</a>
          ) : null}
        </div>
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 3,
    }
  );

  let postsPagination = postsResponse;

  return {
    props: { postsPagination },
  };
};

async function getMorePosts(nextPageUrl, posts: Post[], setPosts, setNextPage) {

  const nextPage = await fetch(nextPageUrl)
  let postResults = await nextPage.json()

  // setPosts([...posts, postResults])
  setPosts([...posts, ...postResults.results])

  setNextPage(postResults.nextPage)
}