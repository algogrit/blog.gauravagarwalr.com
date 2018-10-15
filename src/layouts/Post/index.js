import md5 from "md5"
import React, { PropTypes } from "react"
import ReactDisqusThread from "react-disqus-thread"

import LatestPosts from "../../components/LatestPosts"
import RelatedPosts from "../../components/RelatedPosts"
import Page from "../Page"

import styles from "./index.css"

const Post = (props) => {
  // it's up to you to choose what to do with this layout ;)
  const pageDate = props.head.date ? new Date(props.head.date) : null

  const pageTag = props.head.tags

  return (
    <Page
      { ...props }
      header={
        <div>
          <header className={ styles.header }>
            {
              pageDate &&
              <time key={ pageDate.toISOString() }>
                { pageDate.toDateString() }
              </time>
            }
          </header>
        </div>
      }
      >
      <hr />
      <RelatedPosts relatedTags={pageTag.split(", ")} currentPost={props.head.title} />
      <hr />
      <ReactDisqusThread
        shortname="blog-algogrit"
        identifier={md5(props.head.title)}
        title={props.head.title}/>
      <hr />
      <LatestPosts />
    </Page>
  )
}

Post.propTypes = {
  head: PropTypes.object.isRequired,
}

export default Post
