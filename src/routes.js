import React from "react"
import ReactGA from "react-ga";
import { Route } from "react-router"
import { PageContainer as PhenomicPageContainer } from "phenomic"

ReactGA.initialize('UA-46927901-1');

import AppContainer from "./AppContainer"
import Page from "./layouts/Page"
import PageError from "./layouts/PageError"
import Homepage from "./layouts/Homepage"
import Post from "./layouts/Post"

const PageContainer = (props) => (
  <PhenomicPageContainer
    { ...props }
    layouts={{
      Page,
      PageError,
      Homepage,
      Post,
    }}
  />
)

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

export default (
  <Route component={ AppContainer } onUpdate={logPageView} >
    <Route path="*" component={ PageContainer } />
  </Route>
)
