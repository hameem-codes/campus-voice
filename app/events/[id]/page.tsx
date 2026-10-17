'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { StudentEventDetailView } from '@/views/student/StudentEventDetailView'

export default function EventDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ''

  return <StudentEventDetailView eventId={id} />
}
