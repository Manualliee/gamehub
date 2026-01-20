import React from "react";

interface GameDescriptionProps {
  description: string;
}

export default function GameDescription({ description }: GameDescriptionProps) {
  // Check if the description contains HTML tags
  const hasHtml = /<[a-z][\s\S]*>/i.test(description);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-2">ABOUT THIS GAME</h2>
      <div className="w-full h-0.5 bg-linear-to-r from-accent to-background mb-4"></div>

      {hasHtml ? (
        <div
          className="text-lg/8 max-w-none indent-2 [&_h3]:font-semibold [&_h3]:my-4
          [&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline
          [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: description || "" }}
        ></div>
      ) : (
        <p className="text-lg/8 whitespace-pre-wrap text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
