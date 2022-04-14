import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import * as prismicH from '@prismicio/helpers';
import Prismic from '@prismicio/client';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import Header from '../../components/Header/index';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
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
        <div className={styles.logoContainer}>
          <Header />
        </div>
        <img
          src={post.data.banner.url}
          alt={post.data.title}
          className={styles.banner}
        />
        <div className={styles.contentContainer} key={post.data.title}>
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
            <div>
              <FiClock />
              <span>{getReadTime(post)} min</span>
            </div>
            <span className={styles.invisibleSpan}>4 min</span>
          </div>
          {post.data.content.map((post, index) => (
            <>
              <h2 className={styles.postHeading} key={post.heading}>
                {post.heading}
              </h2>
              <div
                key={index}
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: prismicH.asHTML(post.body),
                }}
              ></div>
            </>
          ))}
        </div>
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

function getReadTime(post: Post) {
  let postContent = post.data.content;

  const headingText = postContent.map(h => h.heading.split(/[, ]+/));
  const postText = postContent.map(p => prismicH.asText(p.body));
  const postWords = postText.map(w => w.split(/[, ]+/));

  headingText.push(...postWords);

  let totalWords = headingText.concat.apply([], headingText);

  let readTime = Math.ceil(totalWords.length / 225);

  return readTime;
}
