'use client';

import React, { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import { Loader2, ChefHat } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dietaryPreference: 'general',
    days: 1,
    people: 1,
    allergies: '',
    cuisine: 'general',
  });
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <ChefHat className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight">AI Chef Planner</h1>
          <p className="mt-2 text-lg text-slate-600">Your personal cooking to-do list based on your day.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                
                <div>
                  <Label.Root className="block text-sm font-medium text-slate-700" htmlFor="dietaryPreference">
                    Dietary Preference
                  </Label.Root>
                  <select
                    id="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  >
                    <option value="general">General</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="mediterranean">Mediterranean</option>
                  </select>
                </div>

                <div>
                  <Label.Root className="block text-sm font-medium text-slate-700" htmlFor="cuisine">
                    Cuisine Preference
                  </Label.Root>
                  <select
                    id="cuisine"
                    value={formData.cuisine}
                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  >
                    <option value="general">General</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Thai">Thai</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>

                <div>
                  <Label.Root className="block text-sm font-medium text-slate-700" htmlFor="days">
                    Number of Days
                  </Label.Root>
                  <input
                    type="number"
                    id="days"
                    min="1"
                    max="14"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <Label.Root className="block text-sm font-medium text-slate-700" htmlFor="people">
                    Number of People
                  </Label.Root>
                  <input
                    type="number"
                    id="people"
                    min="1"
                    max="20"
                    value={formData.people}
                    onChange={(e) => setFormData({ ...formData, people: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label.Root className="block text-sm font-medium text-slate-700" htmlFor="allergies">
                    Allergies or Restrictions
                  </Label.Root>
                  <input
                    type="text"
                    id="allergies"
                    placeholder="e.g. peanuts, dairy"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Generating Plan...
                    </>
                  ) : (
                    'Generate Cooking Plan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Meal Plan</h2>
              <div className="space-y-6">
                {result.mealPlan?.map((day: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h3 className="text-lg font-bold text-indigo-900 mb-4">Day {day.day}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Breakfast</span>
                        <p className="text-slate-800">{day.breakfast}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Lunch</span>
                        <p className="text-slate-800">{day.lunch}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Dinner</span>
                        <p className="text-slate-800">{day.dinner}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Grocery List</h2>
                <ul className="space-y-3">
                  {result.groceryList?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold mr-3">{i + 1}</span>
                      <span className="text-slate-700 pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Substitutions</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {result.substitutions?.map((sub: string, i: number) => (
                      <li key={i} className="text-slate-700">{sub}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 border-t-4 border-indigo-500">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Budget Feasibility</h2>
                  <p className="text-slate-700 leading-relaxed">{result.budgetFeasibility}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
