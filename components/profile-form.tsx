"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/trpc/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MultiSelect } from "@/components/multi-select"

export function ProfileForm({ user }: { user: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    bio: user.profile?.bio || "",
    role: user.profile?.role || "",
    location: user.profile?.location || "",
    skills: user.profile?.skills || [],
    interests: user.profile?.interests || [],
    phone: user.contactInfo?.phone || "",
    linkedin: user.contactInfo?.linkedin || "",
    address: user.contactInfo?.address || "",
  })

  const updateProfile = api.updateProfile.useMutation({
    onSuccess: () => {
      updateContactInfo.mutate({
        email: user.email,
        phone: formData.phone,
        linkedin: formData.linkedin,
        address: formData.address,
      })
    },
    onError: (error) => {
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateContactInfo = api.updateContactInfo.useMutation({
    onSuccess: () => {
      setIsSubmitting(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      router.push("/dashboard")
    },
    onError: (error) => {
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    updateProfile.mutate({
      bio: formData.bio,
      role: formData.role,
      location: formData.location,
      skills: formData.skills,
      interests: formData.interests,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Update your professional profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Professional Role</Label>
            <Input
              id="role"
              name="role"
              placeholder="e.g. Software Engineer, Marketing Manager"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself and your professional background"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. New York, NY"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Skills</Label>
            <MultiSelect
              placeholder="Select or create skills"
              selected={formData.skills}
              setSelected={(skills) => setFormData((prev) => ({ ...prev, skills }))}
              options={[
                "JavaScript",
                "React",
                "Node.js",
                "Python",
                "Marketing",
                "Design",
                "Product Management",
                "Sales",
              ]}
              allowCreate
            />
          </div>
          <div className="space-y-2">
            <Label>Interests</Label>
            <MultiSelect
              placeholder="Select or create interests"
              selected={formData.interests}
              setSelected={(interests) => setFormData((prev) => ({ ...prev, interests }))}
              options={["Technology", "Business", "Design", "Marketing", "Finance", "Education", "Healthcare"]}
              allowCreate
            />
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>This information will only be shared with your connections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="e.g. +1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile (optional)</Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="e.g. https://linkedin.com/in/yourname"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address (optional)</Label>
            <Input
              id="address"
              name="address"
              placeholder="e.g. 123 Main St, City, State"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
