import _ from "lodash"
import React, { PropTypes } from "react"
import { Link } from "phenomic"
import enhanceCollection from "phenomic/lib/enhance-collection"

const defaultNumberOfPosts = 3

const RelatedPosts = (props, { collection }) => {
  const latestPosts = enhanceCollection(collection, {
    filter: { layout: "Post" },
    sort: "date",
    reverse: true,
  })

  const relatedTags = props.relatedTags
  const currentPost = props.currentPost

  const relatedPosts = _.filter(latestPosts, (post) => {
    const postTags = post.tags.split(", ")
    const hasRelatedTag = _.some(postTags, (postTag) => _.includes(relatedTags, postTag))

    return (post.title !== currentPost) && hasRelatedTag
  }).slice(0, props.numberOfPosts || defaultNumberOfPosts)

  return (
    <div>
      <h2>Related Posts</h2>
      {
        relatedPosts.map((page) => (
          <div key={ page.title }>
            <Link to={ page.__url }>
              { page.title }
            </Link>
          </div>
        ))
      }
    </div>
  )
}

RelatedPosts.propTypes = {
  numberOfPosts: PropTypes.number,
  relatedTags: PropTypes.array.isRequired,
  currentPost: PropTypes.string.isRequired
}

RelatedPosts.contextTypes = {
  collection: PropTypes.array.isRequired,
}

export default RelatedPosts
