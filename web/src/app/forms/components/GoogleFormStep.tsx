import CardSection from '@/components/CardSection'

const GoogleFormStep = () => {
  return (
    <CardSection title="Contact Information">
      <div className="w-full">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSc7VthRYvuILqz4bHmGJ8obO3zA7QELBNDhPPkTzbn9AOe76A/viewform?embedded=true"
          className="w-full"
          height="838"
        >
          Loading…
        </iframe>
      </div>
    </CardSection>
  )
}

export default GoogleFormStep
