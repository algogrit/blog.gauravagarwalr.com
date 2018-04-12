import React from "react"

import styles from "./index.css"

const Footer = () => (
  <footer className={ styles.footer }>
    <p>
      <a href="https://gauravagarwalr.com" className={ styles.phenomicReference }>
        Copyright © {(new Date()).getFullYear()} Gaurav Agarwal. All rights reserved.
      </a>
    </p>
  </footer>
)

export default Footer
