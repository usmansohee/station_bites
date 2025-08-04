import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Fade from "react-reveal/Fade";

function About() {
  return (
    <>
      <Head>
        <title>Station Bites | About</title>
      </Head>
      <div className="heightFix px-6">
        <div className="max-w-screen-xl mx-auto md:py-20 py-12 pb-20">
          <div className="xl:text-lg text-base font-medium">
            <h3 className="sm:text-2xl text-xl font-semibold border-b-2 border-gray-200 pb-4 text-gray-700">
              About Station Bites
            </h3>
            <div className="flex md:gap-8 md:flex-row flex-col w-full items-center">
              <div className="mx-auto md:w-3/4 md:max-w-lg max-w-xs">
                <Image
                  src="/img/eating_together.svg"
                  width={400}
                  height={400}
                  alt="Station Bites Food"
                  objectFit="contain"
                />
              </div>
              <div className="flex-grow ml-auto">
                <Fade bottom>
                  <p className="mb-4">
                    Welcome to <strong>Station Bites</strong>, your go-to destination for delicious fast food and quick bites. 
                    We serve fresh, quality food with a focus on taste and convenience.
                  </p>
                  <p className="mb-4">
                    Our menu features crispy chicken dishes, savory soups, delectable cakes, and refreshing juices - 
                    all prepared with care using the finest ingredients.
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
