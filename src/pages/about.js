import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Fade from "react-reveal/Fade";

function About() {
  return (
    <>
      <Head>
        <title>3 in 1 Hot Tandoori Chicken | About</title>
      </Head>
      <div className="heightFix px-6">
        <div className="max-w-screen-xl mx-auto md:py-20 py-12 pb-20">
          <div className="xl:text-lg text-base font-medium">
            <h3 className="sm:text-2xl text-xl font-semibold border-b-2 border-gray-200 pb-4 text-gray-700">
              About 3 in 1 Hot Tandoori Chicken
            </h3>
            <div className="flex md:gap-8 md:flex-row flex-col w-full items-center">
              <div className="mx-auto md:w-3/4 md:max-w-lg max-w-xs">
                <Image
                  src="/img/eating_together.svg"
                  width={400}
                  height={400}
                  alt="3 in 1 Hot Tandoori Chicken Restaurant"
                  objectFit="contain"
                />
              </div>
              <div className="flex-grow ml-auto">
                <Fade bottom>
                  <p className="mb-4">
                    Welcome to <strong>3 in 1 Hot Tandoori Chicken</strong>, your premier destination for authentic tandoori cuisine. 
                    We specialize in traditional tandoori chicken prepared with aromatic spices and cooked to perfection.
                  </p>
                  <p className="mb-4">
                    Our signature 3-in-1 hot tandoori chicken combines three delicious preparations in one meal - 
                    all made with fresh ingredients and traditional cooking methods for an unforgettable dining experience.
                  </p>
                  <p className="mt-6">
                    Contact us: <span className="link text-primary-light">stationbites227@gmail.com</span>
                  </p>
                </Fade>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
