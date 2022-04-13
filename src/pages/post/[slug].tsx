import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import prismicDom from 'prismic-dom';
import Prismic from '@prismicio/client';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import Header from '../../components/Header/index';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  // const { slug } = router.query
  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <Header />
        <img
          src={post.data.banner.url}
          alt={post.data.title}
          className={styles.banner}
        />
        <div className={styles.contentContainer}>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfoContainer}>
            <div>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
          </div>
        </div>
         //! TODO: post content still missing
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title'],
    }
  );

  const paths = postsResponse.results.map(post => {
    return { params: { slug: post.uid } };
  });

  // TODO
  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', slug, {});

  // TODO
  return {
    props: {
      post: response,
    },
  };
};

// function getReadTime(arr) {

// }
