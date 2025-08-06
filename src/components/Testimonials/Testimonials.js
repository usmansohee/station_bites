import Image from "next/image";

function Testimonials() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-screen-xl">
        <h2 className="heading">Our Customers can’t live Without us</h2>
        <div className="flex justify-between mt-20 italic lg:text-base  text-sm gap-6 sm:flex-row flex-col">
          <div className="sm:max-w-xs">
          <div className="font-extrabold text-6xl -mb-8">"</div>
            <p className="text-gray-500">
              "3 in 1 Tandoori Chicken is just awesome! I just launched a startup which leaves me
              with no time for cooking, so 3 in 1 Tandoori Chicken is a life-saver. Now that I
              got used to it, I couldn't live without my daily meals!
            </p>
            <div className="flex items-center sm:mt-8 mt-4 gap-2">
              <div>
                <Image
                  src="/img/testimonials/customer-1.jpg"
                  alt=""
                  width={45}
                  height={45}
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>

              <span>Alberto Duncan</span>
            </div>
          </div>
          <div className="sm:max-w-xs">
            <div className="font-extrabold text-6xl -mb-8">"</div>
            <p className="text-gray-500">
              "3 in 1 Tandoori Chicken has cut down our cooking time in half and fresh ingredients
              are delivered to our door. It's the best thing that has happened to our
              family. We love it!"
            </p>
            <div className="flex items-center sm:mt-8 mt-4 gap-2">
              <div>
                <Image
                  src="/img/testimonials/customer-2.jpg"
                  alt=""
                  width={45}
                  height={45}
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>

              <span>Joana Silva</span>
            </div>
          </div>
          <div className="sm:max-w-xs">
           <div className="font-extrabold text-6xl -mb-8">"</div>
            <p className="text-gray-500">
              I was looking for a quick and easy food delivery service in San
              Franciso. I tried a lot of them and ended up with 3 in 1 Tandoori Chicken. Best
              food delivery service in the Bay Area. Keep up the great work!
            </p>
            <div className="flex items-center sm:mt-8 mt-4 gap-2">
              <div>
                <Image
                  src="/img/testimonials/customer-3.jpg"
                  alt=""
                  width={45}
                  height={45}
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>

              <span>Milton Chapman</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
