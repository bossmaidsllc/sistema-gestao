/*
  # Create message_templates table

  1. New Tables
    - `message_templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `name` (text, template name)
      - `category` (text, channel type: email, sms, whatsapp)
      - `subject` (text, email subject - optional)
      - `message` (text, template content)
      - `variables` (text array, available variables)
      - `usage_count` (integer, how many times used)
      - `is_default` (boolean, system template)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `message_templates` table
    - Add policy for users to manage their own templates
*/

CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'email',
  subject text,
  message text NOT NULL,
  variables text[] DEFAULT ARRAY['nome'],
  usage_count integer DEFAULT 0,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own templates"
  ON message_templates
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default templates
INSERT INTO message_templates (user_id, name, category, subject, message, variables, is_default, usage_count) VALUES
(NULL, 'Oferta Última Hora', 'email', 'Vaga disponível hoje com desconto!', 'Oi {nome}! Tenho uma vaga hoje às {horario} com {desconto} de desconto. Quer aproveitar?', ARRAY['nome', 'horario', 'desconto'], true, 0),
(NULL, 'Reativação Semanal', 'sms', '', 'Oi {nome}! Que tal agendar uma limpeza {servico} esta semana? Tenho horários disponíveis!', ARRAY['nome', 'servico'], true, 0),
(NULL, 'Promoção Especial', 'email', 'Promoção especial só para você!', 'Oi {nome}! Promoção especial de {servico} com {desconto} de desconto. Válida até {data}!', ARRAY['nome', 'servico', 'desconto', 'data'], true, 0);