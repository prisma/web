"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const meetupWrapperClasses = [
  "w-full rounded-lg p-8 mb-8 flex",
  "shadow-[0px_0px_2.4px_rgba(0,0,0,0.01),0px_1.51px_6.64px_rgba(0,0,0,0.02),0px_5.44px_15.98px_rgba(0,0,0,0.04),0px_22px_53px_rgba(0,0,0,0.07)]",
  "[&>div>strong]:font-bold [&>div>strong]:text-xl [&>div>strong]:block [&>div>strong]:mb-1 [&>div>strong]:text-gray-800",
  "[&>div>p]:text-gray-600 [&>div>p]:my-4 [&>div>p]:ml-4 [&>div>p]:list-item",
].join(" ");

const meetupListClasses = [
  "w-full rounded-lg p-8 mb-8",
  "shadow-[0px_0px_2.4px_rgba(0,0,0,0.01),0px_1.51px_6.64px_rgba(0,0,0,0.02),0px_5.44px_15.98px_rgba(0,0,0,0.04),0px_22px_53px_rgba(0,0,0,0.07)]",
  "[&>div]:shadow-none [&>div]:border-b [&>div]:border-gray-200 [&>div]:p-0 [&>div]:mb-6 [&>div]:pb-6",
  "[&>div:last-child]:mb-0 [&>div:last-child]:pb-0 [&>div:last-child]:border-b-0",
].join(" ");

const meetupImgWrapperClasses = [
  "w-10 h-10 rounded-2xl shrink-0 overflow-hidden mr-4",
  "[&_img]:w-10 [&_img]:h-10",
].join(" ");

const meetupButtonRowClasses = [
  "mt-3 flex",
  "[&_a]:font-bold [&_a]:mr-2 [&_a]:underline",
  "[&_a_svg]:h-4 [&_a_svg]:align-middle [&_a_svg]:-mt-[3px]",
].join(" ");

interface MeetupTalk {
  title: string;
  author?: string;
}

interface MeetupProps {
  highlighted?: boolean;
  title: string;
  talks?: MeetupTalk[];
  meetupLink: string;
  youtubeLink?: string;
  imagePath: string;
}

export const MeetupList = ({ children }: { children: React.ReactNode }) => (
  <div className={meetupListClasses}>{children}</div>
);

export const Meetup: React.FC<MeetupProps> = (props) => {
  return (
    <div className={meetupWrapperClasses}>
      <div className={meetupImgWrapperClasses}>
        <Image
          src={props.imagePath}
          alt={props.title}
          width={48}
          height={48}
          className="object-cover not-prose"
        />
      </div>
      <div>
        <strong>{props.title}</strong>
        {props.talks &&
          props.talks.map((talk, idx) => (
            <p key={`talk-${idx}`}>
              {talk.title}{" "}
              {talk.author && (
                <>
                  - <strong>{talk.author}</strong>
                </>
              )}
            </p>
          ))}
        <div className={meetupButtonRowClasses}>
          {props.meetupLink && (
            <a href={props.meetupLink} target="_blank" rel="noreferrer">
              Meetup <ArrowRight className="inline" size={16} />
            </a>
          )}
          {props.youtubeLink && (
            <a href={props.youtubeLink} target="_blank" rel="noreferrer">
              YouTube <ArrowRight className="inline" size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
