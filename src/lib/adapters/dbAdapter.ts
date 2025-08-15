import { isDemoMode } from './index';

// Mock data for demo mode
const DEMO_CLIENTS = [
  {
    id: '1',
    user_id: 'demo-user-123',
    name: 'Sarah Johnson',
    phone: '(305) 555-0124',
    email: 'sarah@email.com',
    address: '123 Oak Street, Miami, FL 33101',
    cleaning_type: 'Deep Clean',
    frequency: 'Weekly',
    total_paid: 1200,
    notes: 'Cliente prefere produtos orgânicos',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user-123',
    name: 'Michael Davis',
    phone: '(305) 555-0125',
    email: 'michael@email.com',
    address: '456 Pine Avenue, Miami, FL 33102',
    cleaning_type: 'Regular',
    frequency: 'Bi-weekly',
    total_paid: 800,
    notes: 'Chave escondida no vaso de plantas',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'demo-user-123',
    name: 'Jessica Brown',
    phone: '(305) 555-0126',
    email: 'jessica@email.com',
    address: '789 Elm Drive, Miami, FL 33103',
    cleaning_type: 'Move In-Out',
    frequency: 'One-time',
    total_paid: 350,
    notes: 'Apartamento vazio, limpeza completa',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    user_id: 'demo-user-123',
    name: 'Amanda Rodriguez',
    phone: '(305) 555-0127',
    email: 'amanda@email.com',
    address: '321 Beach Road, Miami, FL 33104',
    cleaning_type: 'Airbnb',
    frequency: 'Weekly',
    total_paid: 960,
    notes: 'Turnover entre hóspedes, acesso pelo código',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    user_id: 'demo-user-123',
    name: 'Robert Wilson',
    phone: '(305) 555-0128',
    email: 'robert@email.com',
    address: '654 Sunset Ave, Miami, FL 33105',
    cleaning_type: 'Regular',
    frequency: 'Monthly',
    total_paid: 240,
    notes: 'Cliente novo, primeira limpeza mês passado',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_APPOINTMENTS = [
  {
    id: '1',
    user_id: 'demo-user-123',
    client_id: '1',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    category: 'Deep Clean',
    value: 150,
    status: 'scheduled',
    notes: 'Limpeza completa da casa',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user-123',
    client_id: '2',
    date: new Date().toISOString().split('T')[0],
    time: '13:00',
    category: 'Regular',
    value: 80,
    status: 'confirmed',
    notes: 'Limpeza de manutenção',
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 1000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'demo-user-123',
    client_id: '3',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '16:00',
    category: 'Move In-Out',
    value: 200,
    status: 'scheduled',
    notes: 'Limpeza pós-mudança',
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_LEADS = [
  {
    id: '1',
    user_id: 'demo-user-123',
    name: 'Carlos Martinez',
    phone: '(305) 555-0129',
    email: 'carlos@email.com',
    address: '987 Ocean Drive, Miami, FL 33106',
    service: 'Deep Clean',
    budget: 180,
    distance: '2.3 miles',
    status: 'new',
    notes: 'Interessado em limpeza semanal',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user-123',
    name: 'Lisa Parker',
    phone: '(305) 555-0130',
    email: 'lisa@email.com',
    address: '456 Coral Way, Miami, FL 33107',
    service: 'Regular Cleaning',
    budget: 120,
    distance: '1.8 miles',
    status: 'new',
    notes: 'Precisa para este fim de semana',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

class DemoDbAdapter {
  private getStorageKey(table: string) {
    return `demo_${table}`;
  }

  private loadFromStorage(table: string, defaultData: any[]) {
    if (isDemoMode()) {
      const stored = localStorage.getItem(this.getStorageKey(table));
      return stored ? JSON.parse(stored) : defaultData;
    }
    return [];
  }

  private saveToStorage(table: string, data: any[]) {
    if (isDemoMode()) {
      localStorage.setItem(this.getStorageKey(table), JSON.stringify(data));
    }
  }

  async from(table: string) {
    const adapter = this;
    
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => ({
          order: (orderColumn: string, options?: any) => ({
            then: (callback: (result: any) => void) => {
              setTimeout(() => {
                let data: any[] = [];
                
                switch (table) {
                  case 'clients':
                    data = adapter.loadFromStorage('clients', DEMO_CLIENTS);
                    break;
                  case 'appointments':
                    data = adapter.loadFromStorage('appointments', DEMO_APPOINTMENTS);
                    break;
                  case 'leads':
                    data = adapter.loadFromStorage('leads', DEMO_LEADS);
                    break;
                  case 'message_templates':
                    data = adapter.loadFromStorage('templates', []);
                    break;
                  default:
                    data = [];
                }
                
                // Filter by column/value
                if (column && value) {
                  data = data.filter(item => item[column] === value);
                }
                
                // Apply ordering
                if (orderColumn) {
                  data.sort((a, b) => {
                    const aVal = a[orderColumn];
                    const bVal = b[orderColumn];
                    return options?.ascending ? 
                      (aVal > bVal ? 1 : -1) : 
                      (aVal < bVal ? 1 : -1);
                  });
                }
                
                callback({ data, error: null });
              }, 100);
            }
          })
        }),
        then: (callback: (result: any) => void) => {
          setTimeout(() => {
            let data: any[] = [];
            
            switch (table) {
              case 'clients':
                data = adapter.loadFromStorage('clients', DEMO_CLIENTS);
                break;
              case 'appointments':
                data = adapter.loadFromStorage('appointments', DEMO_APPOINTMENTS);
                break;
              case 'leads':
                data = adapter.loadFromStorage('leads', DEMO_LEADS);
                break;
              default:
                data = [];
            }
            
            callback({ data, error: null });
          }, 100);
        }
      }),
      
      insert: (newData: any) => ({
        select: () => ({
          single: () => ({
            then: (callback: (result: any) => void) => {
              setTimeout(() => {
                const data = adapter.loadFromStorage(table, []);
                const newItem = {
                  ...newData,
                  id: Date.now().toString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                data.push(newItem);
                adapter.saveToStorage(table, data);
                
                callback({ data: newItem, error: null });
              }, 100);
            }
          })
        }),
        then: (callback: (result: any) => void) => {
          setTimeout(() => {
            const data = adapter.loadFromStorage(table, []);
            const newItem = {
              ...newData,
              id: Date.now().toString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            data.push(newItem);
            adapter.saveToStorage(table, data);
            
            callback({ data: newItem, error: null });
          }, 100);
        }
      }),
      
      update: (updates: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => ({
              then: (callback: (result: any) => void) => {
                setTimeout(() => {
                  const data = adapter.loadFromStorage(table, []);
                  const index = data.findIndex(item => item[column] === value);
                  
                  if (index !== -1) {
                    data[index] = {
                      ...data[index],
                      ...updates,
                      updated_at: new Date().toISOString()
                    };
                    adapter.saveToStorage(table, data);
                    callback({ data: data[index], error: null });
                  } else {
                    callback({ data: null, error: { message: 'Item not found' } });
                  }
                }, 100);
              }
            })
          }),
          then: (callback: (result: any) => void) => {
            setTimeout(() => {
              const data = adapter.loadFromStorage(table, []);
              const index = data.findIndex(item => item[column] === value);
              
              if (index !== -1) {
                data[index] = {
                  ...data[index],
                  ...updates,
                  updated_at: new Date().toISOString()
                };
                adapter.saveToStorage(table, data);
                callback({ data: data[index], error: null });
              } else {
                callback({ data: null, error: { message: 'Item not found' } });
              }
            }, 100);
          }
        })
      }),
      
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: (callback: (result: any) => void) => {
            setTimeout(() => {
              const data = adapter.loadFromStorage(table, []);
              const filteredData = data.filter(item => item[column] !== value);
              adapter.saveToStorage(table, filteredData);
              callback({ data: null, error: null });
            }, 100);
          }
        })
      })
    };
  }

  resetDemoData() {
    if (isDemoMode()) {
      localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(DEMO_CLIENTS));
      localStorage.setItem(this.getStorageKey('appointments'), JSON.stringify(DEMO_APPOINTMENTS));
      localStorage.setItem(this.getStorageKey('leads'), JSON.stringify(DEMO_LEADS));
      localStorage.setItem(this.getStorageKey('templates'), JSON.stringify([]));
    }
  }
}

export const dbAdapter = new DemoDbAdapter();