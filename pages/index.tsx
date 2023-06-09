import { ReactElement } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import Link from "next/link";
import Image from "next/image";
import { title } from "process";
import { DESTINATIONS, GLOBAL_STYLES, PROJECT_NAME } from "../lib/fixed";
import { useSession } from "next-auth/react";
import Conditional from "../components/Conditional";
import Footer from "../components/Layouts/Footer";

function Home() {
  const { data: session } = useSession();

  const heroSection = () => {
    return (
      <div
        className="p-2 py-6 flex justify-content-center align-items-center lg:gap-4"
        style={GLOBAL_STYLES.forHeaderPattern}
      >
        <div className="w-10 md:w-8 lg:w-4 flex flex-column align-items-center lg:align-items-start">
          <h2 className="mb-2" id="about">
            <Conditional
              if={session}
              show={<>Welcome back {session?.user?.name}</>}
              else={<>Welcome to {PROJECT_NAME}</>}
            />
          </h2>
          <p className="text-gray-300 text-center lg:text-left">
            A template based code-generator that helps you automate your custom
            code generation.
          </p>
          <Link className="p-button no-underline mt-3 lg:mt-4" href="/project">
            <Conditional
              if={session}
              show={<>Go to projects</>}
              else={<>Get started</>}
            />
          </Link>
        </div>
        <Image
          alt={title}
          width="300"
          height="300"
          src="images/circuit-board.svg"
          className="hidden lg:block"
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 75%, 30% 75%, 10% 100%, 10% 75%, 0% 75%)",
          }}
        />
      </div>
    );
  };

  const blocks = ({
    image,
    title,
    note,
    imagePosition,
  }: {
    image: string;
    title: string;
    note: string;
    imagePosition: "left" | "right";
  }) => {
    const imageComponent = (
      <Image
        width="300"
        height="300"
        alt={title}
        style={{
          objectFit: "cover",
        }}
        className="border-1 border-gray-400 border-round-xl max-w-full h-10rem"
        src={`/images/${image}`}
      />
    );

    return (
      <div className="w-8 lg:w-6 gap-4 lg:gap-6 mb-4 m-auto flex flex-column lg:flex-row">
        {imagePosition == "left" ? imageComponent : null}
        <div>
          <h2 className="mb-2" id={title}>
            {title}
          </h2>
          <p className="text-gray-300 line-height-3">{note}</p>
        </div>
        {imagePosition == "right" ? imageComponent : null}
      </div>
    );
  };

  const uiLinks = DESTINATIONS.fromLandingPage.map((link) => (
    <li key={link.label}>
      <Link href={link.url} key={link.label} className="no-underline">
        <Button label={link.label} className="p-button-text p-button-sm" />
      </Link>
    </li>
  ));

  const mobileHeader = (
    <div className="sm:block lg:hidden border-bottom-1 surface-border">
      <ul className="flex justify-content-around align-items-center p-3 list-none">
        <li>
          <h2>{PROJECT_NAME}</h2>
        </li>
        <div>{uiLinks}</div>
      </ul>
    </div>
  );

  const laptopHeader = (
    <div className="hidden lg:block border-bottom-1 surface-border">
      <ul className="flex justify-content-evenly align-items-center p-3 list-none">
        <li>
          <h2>{PROJECT_NAME}</h2>
        </li>
        {uiLinks}
      </ul>
    </div>
  );

  return (
    <>
      {mobileHeader}
      {laptopHeader}

      {heroSection()}

      <Divider className="mb-8 mt-0" />

      {blocks({
        image: "main.jpeg",
        title: "About",
        note: "Codegen is a programmable code-generation tool based on the Liquid template engine.It allows developers to create custom templates for generating code snippets, files, or entire projects from various data schema.Codegen also provides features such as user management, syntax highlighting, and formatting to make the code-generation process easier and faster.",
        imagePosition: "left",
      })}

      <Divider className="w-8 m-auto my-8" />

      {blocks({
        image: "saveTime.jpeg",
        title: "Reason",
        note: "Code-gen is a web-app that can generate code based on predefined templates, rules, and inputs. It can help you save time, reduce errors, and improve consistency. It can improve the quality and consistency of the generated code by allowing developers to follow the same templates, rules, and inputs as their team members.",
        imagePosition: "right",
      })}

      <Divider className="w-8 m-auto my-8" />

      {blocks({
        image: "collaborate.jpeg",
        title: "Collaboration",
        note: "Codegen allows you to manage projects and teams more efficiently by inviting team members to collaborate and assigning different roles and access levels. For example, you can make someone a viewer who can only see the project and the generated code, or an admin who can do everything. Codegen gives you the flexibility and control to work with your team on any code generation task.",
        imagePosition: "left",
      })}
    </>
  );
}

Home.getLayout = function PageLayout(page: ReactElement) {
  return (
    <>
      {page}
      <Footer />
    </>
  );
};

export default Home;
