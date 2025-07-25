export default function RichTextDisplay({ content }: { content: string }) {
  // We are using dangerouslySetInnerHTML to display the content because it is already in HTML format
  // This is a security risk, but we are using it because we trust the content, which is generated by YOU!
  // And that is why you need to keep the repo private, or at least don't let people PR it
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} className="prose" />
  );
}
