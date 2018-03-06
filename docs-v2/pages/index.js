import React from 'react';

import Head from 'next/head';
import { Logos } from '@storybook/components';

import Page, { generator } from '../components/Page';

import Link from '../components/Link';
import TopNav from '../components/TopNav';
import Hero, { HeroTitle, HeroActions } from '../components/Hero';
import { Container as MarkdownContainer, H1 } from '../components/Markdown';
import Blocks, {
  BlockActions,
  BlockLink,
  BlockDescription,
  BlockLabel,
} from '../components/Blocks';
import Button from '../components/Button';
import Container from '../components/Container';

const {
  React: ReactLogo,
  Angular: AngularLogo,
  Vue: VueLogo,
  Ember: EmberLogo,
  Polymer: PolymerLogo,
  Aurelia: AureliaLogo,

  Storybook: StorybookLogo,
  Airbnb: AirbnbLogo,
  Slack: SlackLogo,
  Squarespace: SquarespaceLogo,
  Lonelyplanet: LonelyplanetLogo,
  Coursera: CourseraLogo,

  Percy: PercyLogo,
  Nuxt: NuxtLogo,
  Zeit: ZeitLogo,
  Screener: ScreenerLogo,
} = Logos;

export default generator('RootIndex', () => (
  <Page>
    <Head>
      <title>Storybook docs</title>
    </Head>
    <TopNav />
    <Hero>
      <HeroTitle>
        The extendible component explorer<br />
        you'll <span style={{ color: 'red', fontSize: '0.8em' }}>💖</span> to use
      </HeroTitle>
      <HeroActions>
        <Button href="/guides/why/" size={3}>
          What is Storybook
        </Button>
        <Button href="/guides/setup/" size={3}>
          Add to your project
        </Button>
        <Button href="/examples/" size={3}>
          See examples
        </Button>
        <Button href="/videos/" size={3}>
          Watch talks
        </Button>
      </HeroActions>
    </Hero>
    <Container width={1000} vSpacing={30} hPadding={30}>
      <Blocks padded>
        <section>
          <H1>Quick documentation</H1>
          <MarkdownContainer colored={false}>
            <ol>
              <li>
                <Link href="/guides/setup/">
                  <a>Automatic setup</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup/">
                  <a>Add storybook manually</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup/">
                  <a>Writing stories</a>
                </Link>
              </li>
            </ol>
          </MarkdownContainer>
        </section>
        <section>
          <H1>Custom configuration</H1>
          <MarkdownContainer colored={false}>
            <ol>
              <li>
                <Link href="/guides/setup/">
                  <a>Customise webpack config</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup/">
                  <a>Custom babel config</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup/">
                  <a>Adding global CSS & fonts</a>
                </Link>
              </li>
            </ol>
          </MarkdownContainer>
        </section>
        <section>
          <H1>Try it now</H1>
          <MarkdownContainer colored={false}>
            <code>
              <pre>
                npm i -g @storybook/cli<br />cd my-react-app<br />getstorybook
              </pre>
            </code>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>
    <Container vPadding={30} hPadding={30}>
      <H1>Supported UI libraries / frameworks</H1>
      <Blocks
        max={6}
        colors={[
          'rgba(83, 193, 222, 0.3)',
          'rgba(65, 184, 131, 0.3)',
          'rgba(195, 0, 47, 0.3)',
          'rgba(48, 63, 159, 0.3)',
          'rgba(226, 75, 49, 0.3)',
          'rgba(126, 46, 122, 0.3)',
        ]}
      >
        <BlockLink href="./docs/frameworks/react/">
          <ReactLogo />
        </BlockLink>
        <BlockLink href="./docs/frameworks/vue/">
          <VueLogo />
        </BlockLink>
        <BlockLink href="./docs/frameworks/angular/">
          <AngularLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>in alpha</BlockLabel>
          <PolymerLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>on roadmap</BlockLabel>
          <EmberLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>consideration</BlockLabel>
          <AureliaLogo />
        </BlockLink>
      </Blocks>
    </Container>
    <Container width={1000} vPadding={30} hPadding={30} background="white">
      <H1>
        Used by <small>(live examples)</small>
      </H1>
      <Blocks max={5} colors={['rgba(245, 245, 245, 1)']} vSpacing={10}>
        <BlockLink href="http://example.com">
          <AirbnbLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <SquarespaceLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <LonelyplanetLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <CourseraLogo />
        </BlockLink>
      </Blocks>
      <BlockActions>
        <Button variant="gray" href="/examples">
          More...
        </Button>
      </BlockActions>
    </Container>
    <Container vPadding={30} hPadding={30}>
      <H1>Integrations</H1>
      <Blocks
        max={6}
        colors={[
          'rgba(92,0,123,0.3)',
          'rgba(55, 134, 200, 0.3)',
          'rgba(83,193,222,0.3)',
          'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 1%, rgba(255,255,255,1) 38%, rgb(224, 224, 224) 100%)',
          'rgba(65, 184, 131, 0.3)',
          '#dbdfe1',
          'rgba(65, 184, 131, 0.3)',
          'silver',
          'silver',
        ]}
      >
        <BlockLink href="http://percy.io">
          <PercyLogo />
          <BlockDescription>
            <strong>Percy</strong>
            <br />visual regression testing
          </BlockDescription>
        </BlockLink>
        <BlockLink href="http://screener.io">
          <ScreenerLogo />
          <BlockDescription>
            <strong>Screener</strong>
            <br />visual regression testing
          </BlockDescription>
        </BlockLink>
        <BlockLink href="https://github.com/facebookincubator/create-react-app">
          <ReactLogo />
          <BlockDescription>
            <strong>Create React App</strong>
            <br />official. No Setup. Minimal.
          </BlockDescription>
        </BlockLink>
        <BlockLink href="https://github.com/zeit/next.js">
          <ZeitLogo />
          <BlockLabel>on roadmap</BlockLabel>
          <BlockDescription>
            <strong>Next.js</strong>
            <br />framework for SSR react
          </BlockDescription>
        </BlockLink>
        <BlockLink href="https://nuxtjs.org">
          <VueLogo />
          <BlockDescription>
            <strong>Vue CLI</strong>
            <br />CLI for rapid Vue.js development
          </BlockDescription>
        </BlockLink>
        <BlockLink href="https://nuxtjs.org">
          <NuxtLogo />
          <BlockLabel>on roadmap</BlockLabel>
          <BlockDescription>
            <strong>Nuxt</strong>
            <br />a Versatile Vue.js Framework
          </BlockDescription>
        </BlockLink>
      </Blocks>
    </Container>
    <Container vSpacing={50} hPadding={30} style={{ textAlign: 'center' }}>
      <StorybookLogo width={300} />
      <p>You have reached the bottom of the page</p>
    </Container>
  </Page>
));
