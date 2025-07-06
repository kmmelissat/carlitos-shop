"use client";

import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Title level={1} className="text-gray-800 mb-4">
            🌿 Madreselva Project
          </Title>
          <Text className="text-lg text-gray-600">
            Tailwind CSS + Ant Design Integration Demo
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tailwind CSS Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              Tailwind CSS ✨
            </h2>
            <p className="text-gray-700 mb-4">
              This card is styled with Tailwind CSS utility classes including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Responsive grid layout</li>
              <li>Gradient backgrounds</li>
              <li>Hover effects</li>
              <li>Custom spacing</li>
            </ul>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
              Tailwind Button
            </button>
          </div>

          {/* Ant Design Card */}
          <Card title="Ant Design 🐜" hoverable className="shadow-lg">
            <Text>
              This card uses Ant Design components with pre-built functionality:
            </Text>
            <div className="mt-4">
              <Space direction="vertical" size="small">
                <Text type="secondary">• Rich component library</Text>
                <Text type="secondary">• Built-in accessibility</Text>
                <Text type="secondary">• Consistent design system</Text>
                <Text type="secondary">• Form validation</Text>
              </Space>
            </div>
            <div className="mt-4">
              <Space>
                <Button type="primary">Primary Button</Button>
                <Button type="default">Default Button</Button>
                <Button type="dashed">Dashed Button</Button>
              </Space>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-green-50 border-green-200">
            <Title level={3} className="text-green-800 mb-2">
              Perfect Integration! 🎉
            </Title>
            <Text className="text-green-700">
              Both Tailwind CSS and Ant Design are working together
              harmoniously. You can use Tailwind utilities for custom styling
              while leveraging Ant Design's powerful components.
            </Text>
          </Card>
        </div>
      </div>
    </main>
  );
}
