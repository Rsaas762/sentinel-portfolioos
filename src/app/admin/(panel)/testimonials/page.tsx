import { getRepo } from "@/lib/data";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { PageTitle } from "@/components/admin/page-title";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default async function AdminTestimonialsPage() {
  const session = await getAdminSession();
  // Admins see all testimonials (approved + hidden) in supabase mode.
  const testimonials = await getRepo().listTestimonials();

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Testimonials"
        description="Add quotes from lecturers, clients, and peers. Only approved ones appear publicly."
      />
      <TestimonialsManager
        testimonials={testimonials}
        readOnly={isReadOnlyAdmin(session)}
      />
    </div>
  );
}
