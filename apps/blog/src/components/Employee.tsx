"use client";
import Image from "next/image";

const employeeWrapperClasses = [
  "w-full rounded-lg p-8 mb-8",
  "shadow-[0px_0px_2.4px_rgba(0,0,0,0.01),0px_1.51px_6.64px_rgba(0,0,0,0.02),0px_5.44px_15.98px_rgba(0,0,0,0.04),0px_22px_53px_rgba(0,0,0,0.07)]",
  "[&>strong]:block [&>strong]:mt-4 [&>strong]:ml-[72px] max-md:[&>strong]:ml-0",
  "[&>p]:my-2 [&>p]:ml-[72px] max-md:[&>p]:ml-0",
].join(" ");

const employeeHeaderClasses = "flex max-md:flex-col";

const employeeNamePlateClasses = [
  "flex flex-[2] items-center text-gray-500",
  "[&>img]:w-14 [&>img]:h-14 [&>img]:rounded-full [&>img]:mr-4",
  "[&>div>strong]:font-bold [&>div>strong]:text-xl [&>div>strong]:block [&>div>strong]:mb-1 [&>div>strong]:text-gray-800",
].join(" ");

const employeeSocialsClasses = [
  "flex max-md:mt-4 max-md:-ml-2",
  "[&>a]:bg-gray-300 [&>a]:text-gray-700 [&>a]:block [&>a]:w-8 [&>a]:h-8 [&>a]:rounded-full [&>a]:p-2 [&>a]:ml-2",
  "[&>a>svg]:w-4 [&>a>svg]:h-4",
].join(" ");

interface EmployeeProps {
  name: string;
  title: string;
  joinDate: string;
  imgURL: string;
  funFact: string;
  whyPrisma: string;
  socialURL?: string;
  socialGithub?: string;
  socialLinkedIn?: string;
  socialTwitter?: string;
}

const Employee: React.FC<EmployeeProps> = (props) => {
  return (
    <div className={employeeWrapperClasses}>
      <div className={employeeHeaderClasses}>
        <div className={employeeNamePlateClasses}>
          <Image src={props.imgURL} alt={props.name} width={56} height={56} />
          <div>
            <strong>{props.name}</strong>
            {props.title + " | " + props.joinDate}
          </div>
        </div>
        <div className={employeeSocialsClasses}>
          {props.socialURL && (
            <a href={props.socialURL} target="_blank" rel="noreferrer">
              <i className="fa fa-globe" />
            </a>
          )}
          {props.socialLinkedIn && (
            <a href={props.socialLinkedIn} target="_blank" rel="noreferrer">
              <i className="fa fa-linkedin" />
            </a>
          )}
          {props.socialTwitter && (
            <a href={props.socialTwitter} target="_blank" rel="noreferrer">
              <i className="fa fa-twitter" />
            </a>
          )}
          {props.socialGithub && (
            <a href={props.socialGithub} target="_blank" rel="noreferrer">
              <i className="fa fa-github" />
            </a>
          )}
        </div>
      </div>
      <strong>😆 Fun Fact</strong>
      <p>{props.funFact}</p>
      <strong>❓ Why are you joining Prisma?</strong>
      <p>{props.whyPrisma}</p>
    </div>
  );
};

export { Employee };
