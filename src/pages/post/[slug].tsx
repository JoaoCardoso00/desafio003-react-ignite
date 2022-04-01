import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

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
  const { slug } = router.query;

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
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  // TODO
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async context => {
  const { slug } = context.params;
  let postSlug = slug.toString();

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', postSlug, {});

  // const post = {
  //   first_publication_date: response.first_publication_date,
  //   data: {
  //     title: response.data.title,
  //     banner: {
  //       url: response.data.banner.url
  //     },
  //     author: response.data.author,
  //     content: {
  //       heading: response.data.content[0].heading,
  //       body: response.data.content[0].body
  //     },
  //   }
  // }

  // TODO
  return {
    props: {
      post: response,
    },
  };
};
