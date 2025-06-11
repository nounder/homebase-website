export default function() {
  return (
    <div>
      <ul class="p-4 [&>li]:list-disc [&>li]:list-inside">
        <li>
          <a href="/events">
            Events
          </a>
        </li>

        <li>
          <a href="/about">
            About
          </a>
        </li>
      </ul>
    </div>
  )
}
