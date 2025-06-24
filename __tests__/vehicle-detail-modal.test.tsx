import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VehicleDetailModal from '../components/vehicle-detail-modal'
import { vi } from 'vitest'
import React from 'react'

vi.mock('@/lib/utils', () => ({
  cn: (...c: string[]) => c.filter(Boolean).join(' '),
}))

vi.mock('@/components/ui/carousel', () => {
  const Carousel = ({ children, setApi }: any) => {
    let current = 0
    let selectHandler: () => void = () => {}
    const api = {
      scrollTo: (i: number) => {
        current = i
        selectHandler()
      },
      selectedScrollSnap: () => current,
      on: vi.fn((ev: string, cb: () => void) => {
        if (ev === 'select') selectHandler = cb
      }),
      off: vi.fn(),
    }
    React.useEffect(() => {
      setApi?.(api)
    }, [])
    return <div data-testid="carousel">{children}</div>
  }
  const Wrapper = ({ children }: any) => <div>{children}</div>
  return {
    Carousel,
    CarouselContent: Wrapper,
    CarouselItem: Wrapper,
    CarouselNext: () => <button>next</button>,
    CarouselPrevious: () => <button>prev</button>,
  }
})

vi.mock('@/context/i18n-context', () => ({
  useI18n: () => ({ t: (k: string) => k }),
}))

const vehicle = {
  id: '1',
  name: 'Test Car',
  category: 'sedan',
  seats: 4,
  engine: 'gas',
  pricePerDay: 100,
  images: ['/a.jpg', '/b.jpg'],
}

describe('VehicleDetailModal', () => {
  it('renders thumbnails and updates selection on click', async () => {
    const user = userEvent.setup()
    render(
      <VehicleDetailModal
        vehicle={vehicle as any}
        isOpen={true}
        onClose={() => {}}
        onReserveClick={() => {}}
      />
    )

    const thumbs = screen.getAllByAltText(/thumb/)
    expect(thumbs.length).toBe(2)

    const firstBtn = thumbs[0].closest('button')!
    const secondBtn = thumbs[1].closest('button')!
    expect(firstBtn).toHaveClass('border-kadoshGreen-DEFAULT')
    expect(secondBtn).not.toHaveClass('border-kadoshGreen-DEFAULT')

    await user.click(thumbs[1])

    expect(secondBtn).toHaveClass('border-kadoshGreen-DEFAULT')
    expect(firstBtn).not.toHaveClass('border-kadoshGreen-DEFAULT')
  })
})
