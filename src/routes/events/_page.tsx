export default function() {
  return (
    <div>
      <h1>
        Events
      </h1>
      <button
        class="btn"
        onClick={() => {
          console.log("clicked")
        }}
      >
        Add event
      </button>
    </div>
  )
}
