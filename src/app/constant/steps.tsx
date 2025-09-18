import Image from "next/image";

export const steps = [
  {
    selector: "#help",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold"> This will guide you available commands ! </p>
        <Image src={"/helpDemo.png"} alt="hello" height={400} width={800} />
      </div>
    ),
  },
  {
    selector: "#about",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold"> Information about me ! </p>
        <Image src={"/aboutDemo.png"} alt="hello" height={400} width={800} />
      </div>
    ),
  },
  {
    selector: "#skills",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold"> Skills I have and I can work on them. </p>
        <Image src={"/skillsDemo.png"} alt="hello" height={400} width={800} />
      </div>
    ),
  },
  {
    selector: "#projects",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold"> Projects and their Details </p>
        <Image src={"/projectDemo.png"} alt="hello" height={400} width={800} />
      </div>
    ),
  },
  {
    selector: "#listproject",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold">
          {" "}
          Get projects ids and see its code and live link.{" "}
        </p>
        <Image src={"/listprojectDemo.png"} alt="hello" height={400} width={800} />
      </div>
    ),
  },
  {
    selector: "#direct",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold">
          {" "}
          Type code {"<projectId>"} and get Direct code and live link.
        </p>
        <Image
          src={"/code-livelink.png"}
          alt="hello"
          height={400}
          width={800}
        />
      </div>
    ),
  },
  {
    selector: "#contact",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold"> Contact Me! </p>
        <Image src={"/contactDemo.png"} alt="hello" height={400} width={800} />
      </div>
    ),
  },
  {
    selector: "#clear",
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-bold">Clear all the content for terminal</p>
        <Image src={"/clearDemo.png"} alt="hello" height={400} width={800} />
      </div>
    ),
  },
];
