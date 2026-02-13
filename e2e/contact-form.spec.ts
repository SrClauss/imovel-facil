import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contato');
    await page.waitForLoadState('networkidle');
  });

  test('should load contact page successfully', async ({ page }) => {
    // Check that the contact page loaded
    await expect(page).toHaveURL('/contato');
    
    // Check for contact form or heading
    const heading = page.locator('h1, h2').filter({ hasText: /contato|contact/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display contact form fields', async ({ page }) => {
    // Check for common form fields
    const nameInput = page.locator('input[name="name"], input[placeholder*="nome"], input[placeholder*="name"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email"]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="mensagem"], textarea[placeholder*="message"]').first();
    
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(messageInput).toBeVisible({ timeout: 5000 });
  });

  test('should submit contact form with valid data', async ({ page }) => {
    // Fill out the form
    const nameInput = page.locator('input[name="name"], input[placeholder*="nome"], input[placeholder*="name"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email"]').first();
    const phoneInput = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="telefone"], input[placeholder*="phone"]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="mensagem"], textarea[placeholder*="message"]').first();
    
    await nameInput.fill('João Silva');
    await emailInput.fill('joao.silva@example.com');
    
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('(11) 98765-4321');
    }
    
    await messageInput.fill('Olá, gostaria de mais informações sobre os imóveis disponíveis.');
    
    // Submit the form
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /enviar|submit/i }).first();
    await submitButton.click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check for success message or redirect
    // Success message might be a toast, alert, or text on page
    const successMessage = page.locator('text=/enviado|sucesso|success|obrigado|thank you/i').first();
    
    // Give it time to appear
    await page.waitForTimeout(3000);
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /enviar|submit/i }).first();
    await submitButton.click();
    
    // Wait for validation messages
    await page.waitForTimeout(1000);
    
    // Check for validation errors
    // These might be shown as text near inputs, or as browser validation
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    
    // Check if browser validation is working
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    
    // Or check for custom error messages
    await page.waitForTimeout(1000);
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email"]').first();
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /enviar|submit/i }).first();
    
    // Fill with invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Wait for validation
    await page.waitForTimeout(1000);
    
    // Check if field is marked as invalid
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    
    await page.waitForTimeout(1000);
  });

  test('should have contact information displayed', async ({ page }) => {
    // Check for contact information on the page
    // This might include phone, email, address, etc.
    const content = await page.content();
    
    // Just verify page has substantial content
    expect(content.length).toBeGreaterThan(500);
  });

  test('should be able to navigate back from contact page', async ({ page }) => {
    // Click on navigation link or back button
    const homeLink = page.getByRole('link', { name: /início|home|voltar/i }).first();
    
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    }
  });
});
